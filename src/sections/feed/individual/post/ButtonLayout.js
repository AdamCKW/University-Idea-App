import React, { useState } from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useAlertContext } from '@/context/alert-context';
import Link from 'next/link';

export default function ButtonLayout({ post, userId, setShowForm, showForm }) {
    const { likes, dislikes, author, _id } = post.post;
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();

    const { mutate } = useSWRConfig();

    const handleAction = async (action) => {
        try {
            await axios.put(`/api/posts/${_id}/${action}`, { userId });
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        } finally {
            mutate(`/api/posts/${_id}`);
        }
    };

    const handleCommentForm = () => {
        setShowForm(!showForm);
    };

    return (
        <>
            <CardActions disableSpacing>
                <IconButton
                    aria-label="like post"
                    onClick={() => handleAction('like')}
                >
                    <Badge badgeContent={likes.length} color="primary">
                        <ThumbUpIcon />
                    </Badge>
                </IconButton>

                <IconButton
                    aria-label="dislike post"
                    onClick={() => handleAction('dislike')}
                >
                    <Badge badgeContent={dislikes.length} color="primary">
                        <ThumbDownIcon />
                    </Badge>
                </IconButton>

                <IconButton onClick={handleCommentForm}>
                    <CommentIcon />
                </IconButton>
            </CardActions>
        </>
    );
}
