export default async function api(endpoint) {
    const url = "https://api.github.com";
    const auth = 'f3a6c148adc36bf2cb718d285fade2e3c8f8a901'

    const response = await axios({
        method: 'GET',
        url: `${url}${endpoint}`,
        auth,
    })
        .then(res => { return (res.data) })
        .catch(err => console.log(err));
    return response;
}