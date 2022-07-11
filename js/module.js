const baseUrl = 'https://jsonplaceholder.typicode.com';

const module = {
  getData : async(url) => {
    const res = await fetch(baseUrl + url);
    return res.json();
  },
  deleteData : async(url, id) => {
    const res = await fetch( baseUrl + url + `/${id}`, {
      method: 'DELETE'
    });
    return res;
  }
};

export const getData = module.getData;
export const removeData = module.deleteData;