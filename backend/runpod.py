import constants
import requests
import time
import argparse
import json

def run(prompt, params={}, stream=False):
    request = {
        'prompt': prompt,
        'max_new_tokens': 1800,
        'temperature': 0.3,
        'top_k': 50,
        'top_p': 0.7,
        'repetition_penalty': 1.2,
        'batch_size': 8,
        'stream': stream
    }

    request.update(params)

    response = requests.post(constants.RUNPOD_URL, json=dict(input=request), headers={
        "Authorization": f"Bearer {constants.RUNPOD_API_KEY}"
    })

    if response.status_code == 200:
        data = response.json()
        task_id = data.get('id')
        return stream_output(task_id, stream=stream)


def stream_output(task_id, stream=False):
    url = f"https://api.runpod.ai/v2/{constants.RUNPOD_ENDPOINT}/stream/{task_id}"
    headers = {
        "Authorization": f"Bearer {constants.RUNPOD_API_KEY}"
    }

    previous_output = ''

    try:
        while True:
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                if len(data['stream']) > 0:
                    new_output = data['stream'][0]['output']

                    if stream:
                        print(new_output, end ="")

                    previous_output += new_output
                
                if data.get('status') == 'COMPLETED':
                    if not stream:
                        return previous_output
                    break
                    
            elif response.status_code >= 400:
                print(response)

            # Sleep for 0.1 seconds between each request
            time.sleep(0.1 if stream else 1)
    except Exception as e:
        print(e)
        cancel_task(task_id)
    

def cancel_task(task_id):
    url = f"https://api.runpod.ai/v2/{constants.RUNPOD_ENDPOINT}/cancel/{task_id}"
    headers = {
        "Authorization": f"Bearer {constants.RUNPOD_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    return response


if __name__ == '__main__':

    prompt = '''<s>[INST] Tell me advantages of the Rust programming languages [/INST]\n'''

    params = {}
    start = time.time()
    print(run(prompt))
    print("Time taken: ", time.time() - start, " seconds")