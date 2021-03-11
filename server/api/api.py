from flask import request, jsonify, abort
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

import flask
import json

app = flask.Flask(__name__)
cors = CORS(app, resources={r"/api": {"origins": "http://localhost:3000"}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['Access-Control-Allow-Origin'] = '*'
app.config["DEBUG"] = True

# Create some test data for our catalog in the form of a list of dictionaries.
cars = [
    {
        'id': 0,
        'maker': 'BMW',
        'model': 'Series 3',
        'year': '2019',
        'color': 'black',
        'monthly_subscription': 200,
        'available_from': datetime.now()
    },
    {
        'id': 1,
        'maker': 'BMW',
        'model': 'X1',
        'year': '2020',
        'color': 'darkblue',
        'monthly_subscription': 300,
        'available_from': datetime(2021, 8, 25)
    },
    {
        'id': 2,
        'maker': 'Toyota',
        'model': 'Yaris',
        'year': '2019',
        'color': 'white',
        'monthly_subscription': 150,
        'available_from':  datetime(2021, 3, 15)
    },
    {
        'id': 3,
        'maker': 'Renault',
        'model': 'Clio',
        'year': '2019',
        'color': 'dark red',
        'monthly_subscription': 100,
        'available_from': datetime(2021, 4, 1)
    }
]


# in a normal REST API we will want to use something
# like sqlite3.connect('ourdatabase.db')
@app.route('/api/v1/resources/cars/all', methods=['GET'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def api_all():
    result = sorted(cars, key=lambda k: k['monthly_subscription'])
    for car in cars:
        # better using datetime. not very familiar with python and datetime manipulation
        if(car['available_from'] != None):
            if (datetime.date(car['available_from']).month - datetime.now().month > 3):
                result.remove(car)

    return jsonify(result)


@app.route('/api/v1/resources/cars', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def create_car():
    if not request.json or not 'maker' and 'model' in request.json:
        abort(400)

    print(request.json)
    car = {
        'id': cars[-1]['id'] + 1,
        'maker': request.json['maker'],
        'model': request.json['model'],
        'year': request.json['year'],
        'color': request.json['color'],
        'monthly_subscription': request.json['monthly_subscription'],
        'available_from': None
        # not familar how python needs to convert javascript Date object
        # datetime.strptime(request.json['available_from'], "%Y-%m-%dT%H:%M:%SZ")
    }
    cars.append(car)
    return jsonify({'car': car}), 201


@ app.route('/api/v1/resources/cars/<int:car_id>', methods=['PUT'])
@ cross_origin(origins=['http://localhost:3000'])
def update_car(car_id):
    car = [car for car in cars if car['id'] == car_id]
    if len(car) == 0:
        abort(404)
    if not request.json:
        abort(400)

    car[0]['maker'] = request.json.get('maker', car[0]['maker'])
    car[0]['model'] = request.json.get('model', car[0]['model'])
    car[0]['year'] = request.json.get('year', car[0]['year'])
    car[0]['color'] = request.json.get('color', car[0]['color'])
    car[0]['monthly_subscription'] = request.json.get(
        'monthly_subscription', car[0]['monthly_subscription'])
    car[0]['available_from'] = request.json.get(
        'available_from', car[0]['available_from'])

    return jsonify({'car': car[0]})


@ app.route('/api/v1/resources/cars/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
    car = [car for car in cars if car['id'] == car_id]
    if len(car) == 0:
        abort(404)
    cars.remove(car[0])
    return jsonify({'result': True})


app.run()
