import * as React from "react";
import axios from "axios"
import { Button, Col, Container, FormControl, InputGroup, ListGroup, Row } from "react-bootstrap";
import { CarDetailsForm } from "../Components/CarDetailsForm";

export interface ICar {
  id: number
  maker: string;
  model: string;
  year: string;
  color: string;
  monthly_subscription: number;
  available_from: Date;
}

interface IListState {
  CarList: ICar[],
  Selected: ICar
}

const initialValue = {
  available_from: null,
  color: "",
  id: null,
  maker: "",
  model: "",
  monthly_subscription: null,
  year: ""
}

export const ListingContainer = () => {
  const [list, setList] = React.useState<IListState>({
    CarList: [],
    Selected: initialValue
  });

  const [query, setQuery] = React.useState(null);

  //convert to async and await
  const _fetchCars = () => {
    axios.get("http://127.0.0.1:5000/api/v1/resources/cars/all", {
      method: "GET"
    }).then(
      value => setList({ CarList: value.data, Selected: value.data[0] }),
      reason => {
        console.log(reason);
        alert("An error occurred fetching the list")
      });
  }

  React.useEffect(() => {
    _fetchCars();
  }, []);

  let displayList = [...list.CarList]
  if (query && query.trim()) {
    displayList = displayList.filter(y => y.model.toLowerCase().indexOf(query) !== -1 || y.maker.toLowerCase().indexOf(query) !== -1)
  }

  const _filterCar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value.toLowerCase())
  }

  const _saveCar = (car: ICar) => {
    if (car.id !== null) {
      axios.put("http://127.0.0.1:5000/api/v1/resources/cars/" + car.id, car, { method: "PUT" }).then(
        value => _fetchCars()
      )
    } else {
      axios.post("http://127.0.0.1:5000/api/v1/resources/cars", car, { method: "POST" }).then(
        value => _fetchCars()
      )
    }
  }

  return (
    <Container>
      <Row style={{ marginTop: 10 }}>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search car..."
              onChange={_filterCar}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={() => setList({ ...list, Selected: initialValue })}>Add New</Button>
            </InputGroup.Append>
          </InputGroup>

          <ListGroup as="ul">
            {displayList.map(item =>
              <React.Fragment key={item.id}>
                <ListGroup.Item
                  as="li"
                  onClick={() => setList({ ...list, Selected: item })}
                  active={item.id === list.Selected?.id}
                >
                  {item.maker + " - " + item.model}
                </ListGroup.Item>
              </React.Fragment>
            )}
          </ListGroup>
        </Col>

        <Col>
          <CarDetailsForm Car={list.Selected} OnSave={_saveCar} />
        </Col>
      </Row>
    </Container >
  )
}