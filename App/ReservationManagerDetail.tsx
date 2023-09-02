import React, { useState, useCallback } from 'react';

import UTILS from '../utilities/utils';
import {useFocusEffect} from '@react-navigation/native';

type DateObj = {
  dateStr: String;
  year: String;
  month: String;
  day: String;
  hour: String;
  minute: String;
};

type ReservationManagerDetailProp = {
  username: String;
  pubId: String;
  dateTimeOfReservation: DateObj;
  isAtLeastOwner: Boolean;
  refresher: Boolean;
};

const ReservationManagerDetail: React.FC<ReservationManagerDetailProp> = ({
  username,
  pubId,
  dateTimeOfReservation,
  isAtLeastOwner,
  refresher,
}) => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = (refresher: Boolean) => {
    console.log(refresher);
    const apiToCall = isAtLeastOwner
      ? '/getReservation'
      : '/getUserReservation';
    const bodyObj = isAtLeastOwner
      ? {date: dateTimeOfReservation, pubId}
      : {username, pubId};
    console.log(bodyObj);
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(bodyObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
      })
      .catch(error => console.log(error));
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations(refresher);
    }, []),
  );
};

export default ReservationManagerDetail;