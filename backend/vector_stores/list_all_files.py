from openai import OpenAI
from dotenv import load_dotenv
import asyncio

load_dotenv()

client = OpenAI()

# list all files in the vector store
async def list_all_files():
    files = client.files.list()
    # Return the files object instead of just printing it
    return files

# if __name__ == "__main__":
#     asyncio.run(list_all_files())



