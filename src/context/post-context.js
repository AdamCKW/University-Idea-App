import React, { useContext, useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const PostContext = React.createContext();

const fetchPosts = async (
    url,
    setLoading,
    setListPost,
    setPageLimit,
    setTotalPosts
) => {
    try {
        setLoading(true);
        const { data } = await axios.get(url);
        const { limit, total, posts } = data;

        const listPost = posts?.map(
            ({
                _id,
                title,
                desc,
                author,
                likes_count,
                dislikes_count,
                isAuthHidden,
                comments,
                createdAt,
                category,
                views,
            }) => ({
                id: _id,
                title,
                desc,
                author,
                likes: likes_count,
                dislikes: dislikes_count,
                isAuthHidden,
                comments,
                createdAt,
                category,
                views,
            })
        );

        setListPost(listPost || []);
        setPageLimit(limit);
        setTotalPosts(total);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
};

const PostProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const [listPost, setListPost] = useState([]);
    const [pageLimit, setPageLimit] = useState();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sort: 'createdAt', order: 'desc' });
    const [categoryOptions, setCategoryOptions] = useState([]);

    const feedUrl = `/api/feeds?page=${page}&sortBy=${sort.sort}&sortOrder=${
        sort.order
    }&category=${categoryOptions.toString()}&search=${search}`;

    const { data, error } = useSWR(
        feedUrl,
        useCallback(
            (url) =>
                fetchPosts(
                    url,
                    setLoading,
                    setListPost,
                    setPageLimit,
                    setTotalPosts
                ),
            [setLoading, setListPost, setPageLimit, setTotalPosts]
        ),
        { revalidateOnFocus: false, refreshInterval: 300000 }
    );

    useEffect(() => {
        setLoading(!data && !error);
    }, [data, error]);

    return (
        <PostContext.Provider
            value={{
                loading,
                listPost,
                pageLimit,
                totalPosts,
                page,
                feedUrl,
                sort,
                setCategoryOptions,
                setSort,
                setPage,
                setSearch,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

// make sure use
export const usePostContext = () => {
    return useContext(PostContext);
};

export { PostContext, PostProvider };
