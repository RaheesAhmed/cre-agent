from dotenv import load_dotenv
from openai import OpenAI
import asyncio

load_dotenv()


client = OpenAI()


# delete vector store by id
async def delete_vector_store(vector_store_id):
    deleted_vector_store = client.vector_stores.delete(
        vector_store_id=vector_store_id
    )
    return deleted_vector_store




# if __name__ == "__main__":
#     asyncio.run(delete_vector_store("vs_cUZo4eHZfQH2glpIAMSG0m2z"))
#     asyncio.run(delete_vector_store("vs_746axb41w80RUzGzPHPoMMEW"))

