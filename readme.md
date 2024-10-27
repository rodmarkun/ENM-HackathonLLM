# HackathonLLM Project by ENM

Project designed for [LLMHackathon by CodeGPT, GuruSup and Mistral](https://llmhackathon.dev/). Project is made from scratch and without templates in NextJS (frontend) and Python (backend). The project automatically processes customer support tickets aided by LLMs and inside logic. The pipeline can be described as follows:

<p align="center">
  <img src="https://github.com/user-attachments/assets/f412f3bc-8486-4c3e-8189-805c9cd9c2b2" width="1100" height="auto">
</p>


## Pipeline

When a ticket is created by a user, it is automatically processed by a series of models in order to classify it with different labels:
- **Sentiment Analysis**: [DistilBert Cased Sentiment via HuggingFace Inference API](https://huggingface.co/lxyuan/distilbert-base-multilingual-cased-sentiments-student)
- **Category Classification**: Mistral AI Agent using Mistral Nemo. (Agent ID: ag:fc4e91ab:20241026:ticketcategorizer:245e9828)
- **Priority Classification**: Mistral AI Agent using Mistral Nemo. (Agent ID: ag:fc4e91ab:20241026:untitled-agent:592cd06d)
- **Language Detection**: [Facebook's FastText Language Identification via HuggingFace Inference API](https://huggingface.co/facebook/fasttext-language-identification)

<p align="center">
  <img src="https://github.com/user-attachments/assets/b61dff65-bc0b-4112-b64c-171ca3d3d19b" width="350" height="auto">
</p>


After this initial processing, the system can either auto-answer the ticket via LLM or generate a template response for human review, based on the frontend configuration. These automated actions are determined by filters that consider the ticket's classifications (priority, category, sentiment, etc.).

In order to generate a direct answer or a template for the Ticket, the main LLM (which is a Mistral AI Agent using Mistral Large 2, Agent ID: ag:fc4e91ab:20241026:hackathonllm:07fc6cf1) uses:
- **A company context file**: Admins can upload this through the dashboard frontend, and it's stored on Amazon S3. When a response is needed, the system retrieves this file to access company information.
- **Similar tickets**: The system maintains clusters of previously closed tickets. Using embeddings of ticket descriptions stored in these clusters, it performs semantic similarity searches. When matches exceed a certain threshold, it uses those previous answers to provide additional context to the LLM.
- **The current Ticket's details**: Along with the ticket information itself, the system includes instructions about whether to provide a direct answer or use a template format.

<p align="center">
  <img src="https://github.com/user-attachments/assets/08267c27-4c0b-44bb-af41-af427856eee3" width="950" height="auto">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/97a1d9c1-1f8f-4dae-be25-e87282baaf8c" width="1100" height="auto">
</p>

## Usage of CodeGPT

The usage of CodeGPT was one of the requirements in order to participate in this Hackathon. Our team used CodeGPT for the following use cases:

- Improvement and iteration of prompts for Mistral AI
![image](https://github.com/user-attachments/assets/b8f71cb6-80ac-4369-8ee4-77fac8d64e6a)
- Code generation support using the VSCode extension
![image](https://github.com/user-attachments/assets/1d8a4db5-12ed-41bf-84e1-ab13ebc2ea1d)


## Contact
You might find us on x.com:

- <a href="https://x.com/neocathedral" target="_blank">daniel</a>
- <a href="https://x.com/_setPedro" target="_blank">pedro</a>
- <a href="https://x.com/rodmarkun" target="_blank">pablo</a>
