curl -X POST http://10.1.1.102:5000/ws/receipt
sleep 5 && curl -d "Acknowledge=Print CB OK" -H "Content-Type: application/x-www-form-urlencoded" -X POST http://10.1.1.102:5000/ws/cmdack
sleep 5 && curl -d "Acknowledge=Print DATA OK" -H "Content-Type: application/x-www-form-urlencoded" -X POST http://10.1.1.102:5000/ws/cmdack