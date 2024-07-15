
// actions.js
export const FETCH_BRANDS = 'FETCH_BRANDS';
export const FETCH_CARS = 'FETCH_CARS';
export const DELETE_CARS = 'DELETE_CARS';
export const ADD_CARS = 'ADD_CARS';
export const ADD_BRAND = 'ADD_BRAND';

export const fetchBrands = (brands) => ({
    type: FETCH_BRANDS,
    payload: brands
});

export const fetchCars = (cars) => ({
    type: FETCH_CARS,
    payload: cars
});

export const deleteCar = (cars) =>({
    type : DELETE_CARS,
    payload: cars
})

export const addCar = (cars) =>({
    type : ADD_CARS,
    payload : cars
})
export const addBrand = (brand) => ({
    type: ADD_BRAND,
    payload: brand,
  });