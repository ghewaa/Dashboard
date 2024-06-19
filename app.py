from flask import Flask, request, jsonify
import pandas as pd
import seaborn as sns
from flask_cors import CORS
import logging
import io
import matplotlib.pyplot as plt
import os
import s3fs

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Set environment variables
os.environ["AWS_ACCESS_KEY_ID"] = 'ZOUPWMGL0EHB13YOLDFJ'
os.environ["AWS_SECRET_ACCESS_KEY"] = 'TqLWMFDcXvoRIbwQNhdNhtYCJr7Li+Cm4Wi4gT9P'
os.environ["AWS_SESSION_TOKEN"] = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJaT1VQV01HTDBFSEIxM1lPTERGSiIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sImF1ZCI6WyJtaW5pby1kYXRhbm9kZSIsIm9ueXhpYSIsImFjY291bnQiXSwiYXV0aF90aW1lIjoxNzE4Nzg2NDIzLCJhenAiOiJvbnl4aWEiLCJlbWFpbCI6ImdoZXdhLmVsZG9yYUBlbnNhZS5mciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE3MTk0MDI1NTIsImZhbWlseV9uYW1lIjoiRWxkb3JhIiwiZ2l2ZW5fbmFtZSI6IkdoZXdhIiwiZ3JvdXBzIjpbIlVTRVJfT05ZWElBIl0sImlhdCI6MTcxODc5Nzc1MiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmxhYi5zc3BjbG91ZC5mci9hdXRoL3JlYWxtcy9zc3BjbG91ZCIsImp0aSI6IjMyZThhZWIyLWUyOTMtNGUyOC1iNGExLWJiYWJjZGEwNThmNSIsIm5hbWUiOiJHaGV3YSBFbGRvcmEiLCJwb2xpY3kiOiJzdHNvbmx5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYXowIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXNzcGNsb3VkIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBncm91cHMgZW1haWwiLCJzZXNzaW9uX3N0YXRlIjoiZDFmYmQ5NjItMGEzMS00NzY3LWFmMmYtYjdiNDg5ZWU4Y2I4Iiwic2lkIjoiZDFmYmQ5NjItMGEzMS00NzY3LWFmMmYtYjdiNDg5ZWU4Y2I4Iiwic3ViIjoiNGE1OWU1N2EtMjE0ZS00YzE0LThkYjktNjM1YmE3ODI2YzFjIiwidHlwIjoiQmVhcmVyIn0.V8gRXTfngt9cyOdf_rfG1PcwYT2FWCjqJGvhw24GsQi8xm7Ts-_8SYZDiTPPhHrcXZuMQjIZV586JPREB3ctgQ'
os.environ["AWS_DEFAULT_REGION"] = 'us-east-1'

# Create a filesystem object
fs = s3fs.S3FileSystem(
    client_kwargs={'endpoint_url': 'https://' + 'minio.lab.sspcloud.fr'},
    key=os.environ["AWS_ACCESS_KEY_ID"],
    secret=os.environ["AWS_SECRET_ACCESS_KEY"],
    token=os.environ["AWS_SESSION_TOKEN"]
)

# Path to your file in the S3 bucket
bucket_name = 'az0'
file_key = 'Products_20182021.csv'
s3_path = f's3://{bucket_name}/{file_key}'

# Read the CSV file into a pandas DataFrame once globally
original_df = pd.read_csv(s3_path, storage_options={
    'key': os.environ["AWS_ACCESS_KEY_ID"],
    'secret': os.environ["AWS_SECRET_ACCESS_KEY"],
    'token': os.environ["AWS_SESSION_TOKEN"],
    'client_kwargs': {'endpoint_url': 'https://' + 'minio.lab.sspcloud.fr'}
})

@app.route('/')
def home():
    return "Flask server is running"

@app.route('/parameters', methods=['GET'])
def get_parameters():
    logging.debug("Received request for parameters")
    
    # Use the global original dataframe
    categories = original_df['Categories'].unique().tolist()
    categories.insert(0, 'allFood')  # Add 'allFood' at the beginning of the list
    years = original_df['year'].unique().tolist()
    presences = original_df['presence'].unique().tolist()
    outcomes = ['grade', 'nutriscore']
    scans = ['all', 'most']
    weights = ['no-weight', 'scan-weight']
    
    parameters = {
        'categories': [{'value': cat, 'label': 'All Food' if cat == 'allFood' else cat} for cat in categories],
        'years': [{'value': year, 'label': year} for year in years],
        'presences': [{'value': pres, 'label': pres} for pres in presences],
        'outcomes': [{'value': out, 'label': out.capitalize()} for out in outcomes],
        'scans': [{'value': scan, 'label': scan.capitalize()} for scan in scans],
        'weights': [{'value': weight, 'label': weight.replace('-', ' ').capitalize()} for weight in weights]
    }
    
    return jsonify(parameters)

@app.route('/generate-graph', methods=['POST'])
def generate_graph():
    logging.debug("Received request to generate graph")
    data = request.json
    logging.debug(f"Request data: {data}")

    category = data.get('category')
    year = data.get('year')
    presence = data.get('presence')
    outcome = data.get('outcome')
    scans = data.get('scans')
    weight = data.get('weight')

    logging.debug("Resetting data to the original dataframe")
    # Use the global original dataframe
    df = original_df.copy()

    # Filtering logic based on the received parameters
    if category != 'allFood':
        df = df[df['Categories'] == category]

    if presence:
        df = df[df['presence'] == presence]

    if year:
        df = df[df['year'] == int(year)]

    if scans == 'most':
        df = df[df['scan_count'] >= 50000]

    if outcome == 'grade':
        outcome_column = 'grade' 
    elif outcome == 'nutriscore':
        outcome_column = 'nutriscore'

    logging.debug(f"Filtered data shape: {df.shape}")
    
    # Clear the previous plot
    plt.clf()

    # Create a subset with the relevant columns
    plot_data = df[[outcome_column, 'scan_count']].dropna()
    
    if weight == 'scan-weight':
        weights = plot_data['scan_count'] / plot_data['scan_count'].sum()
    else:
        weights = None

    # Generate KDE plot
    kde = sns.kdeplot(data=plot_data, x=outcome_column, weights=weights)
    
    kde_lines = kde.get_lines()[0]
    x_data = kde_lines.get_xdata()
    y_data = kde_lines.get_ydata()
    logging.debug(f"KDE x_data: {x_data[:5]}")  # Log first 5 elements for brevity
    logging.debug(f"KDE y_data: {y_data[:5]}")  # Log first 5 elements for brevity

    kde_data = pd.DataFrame({'Grade': x_data, 'Density': y_data})

    # Convert the DataFrame to CSV format in memory
    csv_buffer = io.StringIO()
    kde_data.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    csv_content = csv_buffer.getvalue()
    logging.debug("CSV content returned")

    return jsonify({'csv_content': csv_content})

if __name__ == '__main__':
    app.run(debug=True)
