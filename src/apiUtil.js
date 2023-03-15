import axios from 'axios';

const api = axios.create({
  baseURL: 'https://challenge.crossmint.io/api',
});

//Polyanet API 
export const addPolyanet = async (candidateId, row, column) => {
  return await api.post('/polyanets', { candidateId, row, column });
};

export const deletePolyanet = async (candidateId, row, column) => {
  return await api.delete('/polyanets', { data: { candidateId, row, column } });
};

//Soloon API
export const  addSoloon = async(candidateId, row, column, color) => {
  return await api.post('/soloons', { candidateId, row, column, color });
}

export const deleteSoloon = async(candidateId, row, column) => {
  return await api.delete('/soloons', { data: { candidateId, row, column } });
}

//Cometh API
 export const addCometh = async(candidateId, row, column, direction) =>{
  return  await api.post('/comeths', { candidateId, row, column, direction });
}

export const deleteCometh = async(candidateId, row, column) => {
  return await api.delete('/comeths', { data: { candidateId, row, column } });
}

// Map API
export const getMap = async (candidateId) => {
  return api.get(`/map/${candidateId}/goal`)
  .then(response => {
    return response.data.goal;
  })
  .catch(error => {
    console.log(error);
  });
};

//Mock API for testing locally
export const createPolyanetMock = async (candidateId, row, column) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { success: true } });
    }, 100);
  });
};

export const deletePolyanetMock = async (candidateId, row, column) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { success: true } });
    }, 100);
  });
};