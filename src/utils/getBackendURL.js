const getBackendURL = () => {
    console.log(import.meta.env.PROD);
    return (
        import.meta.env.PROD? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_DEV_BACKEND_URL
    );
}
 
export default getBackendURL;