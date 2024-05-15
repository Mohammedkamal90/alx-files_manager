import requests

# Define the URL of the server endpoint for file upload
upload_url = 'http://your_server_url/upload'

# Define the path to the image file you want to upload
image_path = 'path_to_your_image_file.jpg'

# Open the image file in binary mode
with open(image_path, 'rb') as file:
    # Prepare the payload for the POST request
    files = {'file': file}

    try:
        # Send the POST request to upload the file
        response = requests.post(upload_url, files=files)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            print("File uploaded successfully.")
        else:
            print("Error:", response.text)
    except requests.exceptions.RequestException as e:
        # Handle any network-related errors
        print("Error:", e)
