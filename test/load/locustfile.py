import os
from locust import HttpUser, task, wait_time, between

class OrderUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        self.client.headers = {'X-API-KEY': os.environ.get('SHOPEE_SERVICE_API_KEY')}
    
    @task
    def get_order_list(self):
        params = {
            'user_id': 'sandbox12345',
            'time_range_field': 'create_time',
            'time_from': 1668742597,
            'time_to': 1669606597,
            'page_size': 10,
            'status': 'READY_TO_SHIP',
            'response_optional_fields': 'order_status'
            
            
        }
        response = self.client.get('shopee/order/get_order_list', params=params )
        if not response.ok:
            print(response.json()) 
        