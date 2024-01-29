import redis
import os
import random

run_id = os.getenv('RUN_ID')
output_loc = os.getenv('OUTPUT_LOC')
input_max = os.getenv('INPUT_MAX')
redis_connection_url = os.getenv('REDIS_CONNECTION_URL')

num = random.randint(0, input_max)
print(f'Generated number {num}')

redis_connection = redis.from_url(redis_connection_url)

redis_connection.set(f'{run_id}.{output_loc}', num)

redis_connection.close()