import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICar } from "../Container/ListingContainer";

interface ICarDetailsProps {
  Car: ICar;
  OnSave: (car: ICar) => void;
}

export const CarDetailsForm = (props: ICarDetailsProps) => {
  const [car, setCar] = React.useState<ICar>(props.Car);
  React.useEffect(() => setCar(props.Car), [props.Car, props.Car?.id])

  const _onFormChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const value = e.currentTarget.type === "number" ? e.currentTarget.valueAsNumber :
    //   e.currentTarget.type === "date" ? e.currentTarget.valueAsDate : e.currentTarget.value

    const target = e.currentTarget;
    let value: string | number | Date = e.currentTarget.value;
    if (target.type === "number") {
      value = target.valueAsNumber
    } else if (target.type === "date") {
      value = target.valueAsDate
    }

    setCar({ ...car, [target.name]: value })
  }

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.OnSave(car)
  }

  return (
    <Form onSubmit={_onSubmit}>
      <Form.Group as={Row}>
        <Form.Label column sm={4}>
          Maker
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            required={true}
            placeholder="Please enter a car maker"
            name="maker"
            value={car?.maker ?? ""}
            onChange={_onFormChanged} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={4}>
          Model
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            required={true}
            placeholder="Please enter a car? model"
            name="model"
            value={car?.model ?? ""}
            onChange={_onFormChanged} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={4}>
          Year
    </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            name="year"
            value={car?.year ?? ""}
            onChange={_onFormChanged} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={4}>
          Color
    </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            name="color"
            value={car?.color ?? ""}
            onChange={_onFormChanged} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={4}>
          Monthly Subscription
    </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="number"
            name="monthly_subscription"
            required={true}
            value={car?.monthly_subscription ?? ""}
            onChange={_onFormChanged} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={4}>
          Available From
        </Form.Label>
        <Col sm={8}>
          <input
            type="date"
            name="available_from"
            value={car && car.available_from ? new Date(car.available_from).toISOString().substr(0, 10) : ""}
            onChange={_onFormChanged} />
        </Col>
      </Form.Group>

      <Button type="submit" variant="success" style={{ float: "left" }}>Save</Button>
      <Button variant="secondary" style={{ float: "right" }}>Cancel</Button>
    </Form>
  )
}