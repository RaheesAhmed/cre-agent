import asyncio
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

# delete file by id
async def delete_file(file_id):
    deleted_file = client.files.delete(file_id)
    return deleted_file

