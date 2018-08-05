import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardHeader, CardText, CardBody, CardTitle, Button,
} from 'reactstrap';
import isAuthorized from '../../Utils/isAuthorized';
import SubControl from './SubControl';

const TripView = ({ trip }) => (
  <Container>
    <Row>
      <Col sm="12" md={{ size: 8, offset: 2 }}>
        <Card>
          <CardHeader tag="h3">
            {trip.name}
          </CardHeader>
          <CardBody>
            <CardTitle>
              Date Start:
              {trip.dateStart}
            </CardTitle>
            <CardTitle>
              Date End:
              {trip.dateEnd}
            </CardTitle>
            <CardText>
              Location start:
              {trip.locationStart}
            </CardText>
            <CardText>
              Location end:
              {trip.locationEnd}
            </CardText>
            <CardText>
              Cost of Trip:
              {trip.tripCost}
            </CardText>
            <CardText>
              Description:
              {trip.description}
            </CardText>

            <Link to="../trips">
              <Button color="primary">
                Back
              </Button>
            </Link>

            { isAuthorized() ? <SubControl tripId={trip.id} /> : null }

          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default TripView;
