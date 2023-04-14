import React, { useState } from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import { usePostContext } from 'src/context/post-context';
import { useAlertContext } from 'src/context/alert-context';
import { useSWRConfig } from 'swr';
import Link from 'next/link';

export default function ButtonLayout({ post, userId }) {
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();
    const { feedUrl } = usePostContext();
    const { likes, dislikes, author, id, views, deleted } = post;

    const { mutate } = useSWRConfig();

    const handleAction = async (action) => {
        try {
            await axios.put(`/api/posts/${id}/${action}`, { userId });
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        } finally {
            mutate(feedUrl);
        }
    };

    return (
        <>
            <CardActions disableSpacing>
                <IconButton
                    aria-label="like post"
                    onClick={() => handleAction('like')}
                    disabled={deleted}
                >
                    <Badge badgeContent={likes} color="primary">
                        <ThumbUpIcon />
                    </Badge>
                </IconButton>

                <IconButton
                    aria-label="dislike post"
                    onClick={() => handleAction('dislike')}
                    disabled={deleted}
                >
                    <Badge badgeContent={dislikes} color="primary">
                        <ThumbDownIcon />
                    </Badge>
                </IconButton>

                <IconButton aria-label="dislike post" disabled>
                    <Badge badgeContent={views} color="primary">
                        <VisibilityIcon />
                    </Badge>
                </IconButton>

                <Box sx={{ marginLeft: 'auto' }}>
                    <Link href={`/${id}`} passHref>
                        <Button
                            size="small"
                            onClick={() => handleAction('view')}
                        >
                            Learn More
                        </Button>
                    </Link>
                </Box>
            </CardActions>
        </>
    );
}
