// reducers.js
import { ADD_BRAND, ADD_CARS, DELETE_CARS, FETCH_BRANDS, FETCH_CARS } from './AdminAction';

const initialState = {
    brand: [],
    cars: []
};

const AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BRANDS:
            return {
                ...state,
                brand: action.payload
            };
        case FETCH_CARS:
            return {
                ...state,
                cars: action.payload
            };
        case  DELETE_CARS:
            return {
               ...state,
                cars: state.cars.filter(car => car.id!== action.payload)
            };
        case ADD_CARS:
            return {
               ...state,
                cars: [...state.cars, action.payload]
            };   
            case ADD_BRAND:
                return {
                  ...state,
                  brands: [...state.brand, action.payload],
                };    
        default:
            return state;
    }
};

export default AdminReducer;
