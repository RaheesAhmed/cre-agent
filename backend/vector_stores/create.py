import asyncio
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

# create vector store
async def create_vector_store(name):
    vector_store = client.vector_stores.create(        # Create vector store
        name=name,
    )
    return vector_store

# upload file to vector store
async def upload_file(vector_store_id, file_path):
    client.vector_stores.files.upload_and_poll(       
        vector_store_id=vector_store_id,
        file=open(file_path, "rb")
    )

# create all vector stores
async def create_all_vector_stores():
    
    educational_vector_store = await create_vector_store("Educational Information")
    print(educational_vector_store)

    financial_model_vector_store = await create_vector_store("Financial Model")
    print(financial_model_vector_store)

    market_data_vector_store = await create_vector_store("Market Data")
    print(market_data_vector_store)

    property_data_vector_store = await create_vector_store("Property Data")
    print(property_data_vector_store)

    submarket_data_vector_store = await create_vector_store("Submarket Data")
    print(submarket_data_vector_store)



# if __name__ == "__main__":
#     asyncio.run(create_all_vector_stores())
    #response
    # ID: vs_67f0f4b3f77c8191899270022e750386, Name: Submarket Data
    # ID: vs_67f0f4b34e508191b5349dcf0c6a701f, Name: Property Data
    # ID: vs_67f0f4b289188191b2fb7df83d5787e2, Name: Market Data
    # ID: vs_67f0f4b1d8288191990b93354f0e277f, Name: Financial Model
    # ID: vs_67f0f4b0c2d881918b5c6a390b000d71, Name: Educational Information









