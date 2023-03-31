import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                const res = await axios.get('/api/categories', {
                    cancelToken: source.token,
                });
                if (isMounted) {
                    setCategories(res.data);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    throw error;
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            source.cancel();
        };
    }, []);

    return categories;
};

export default useFetchCategories;
