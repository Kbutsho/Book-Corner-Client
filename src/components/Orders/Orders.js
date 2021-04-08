import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { UserContext } from '../../App';

const Orders = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    console.log(setLoggedInUser);

    const [selectedDate, setSelectedDate] = useState({
        checkIn: new Date()
    });
    const handleCheckIn = (date) => {
        const newDates = { ...selectedDate }
        newDates.checkIn = date;
        setSelectedDate(newDates);
    };

    const { bookName } = useParams();
    console.log("UseParams data", bookName);
    const [bookData, setBookData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3001/getBooks')
            .then(res => res.json())
            .then(data => setBookData(data))
    }, [])
    const selectedBook = bookData.find(book => book.BookName === bookName);
    

    const handelBooking = ()=>{
        const newBooking = {...loggedInUser, ...selectedDate};
        fetch('http://localhost:3001/addBooking', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newBooking)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })

    }
    return (
        <div className="container my-5">

            <h1>CheckOut</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <td>Description</td>
                        <td className="text-center">Quantity</td>
                        <td className="text-center">Price</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{selectedBook?.BookName}</td>
                        <td className="text-center">1</td>
                        <td className="text-center"> {selectedBook?.Price}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td className="text-center"> {selectedBook?.Price}</td>
                    </tr>
                    <tr>
                        <td>Order Date</td>
                        <td>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        id="Order Date"
                                        label="Order Date"
                                        value={selectedDate.checkIn}
                                        onChange={handleCheckIn}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </td>
                        <td className="text-center"><Link to="/orderBooked" onClick={handelBooking}><button className="btn btn-info mt-3">CheckOut</button></Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Orders;