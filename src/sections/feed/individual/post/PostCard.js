import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import {
    Paper,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    Chip,
    useTheme,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';

import EditDialog from '@/sections/feed/individual/post/EditDialog';
import DropDownButton from '@/sections/feed/individual/post/DropDownButton';
import ButtonLayout from '@/sections/feed/individual/post/ButtonLayout';
import { getFormatDate } from '@/utils/getFormatDate';

import Image from 'next/image';

export default function PostCard({ post, setShowForm, userId, showForm }) {
    const theme = useTheme();
    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    const { title, author, desc, isAuthHidden, createdAt, deleted } = post.post;
    const [dialog, setDialog] = useState(false);

    useEffect(() => {
        if (author !== null) {
            const owner = userId === author._id;
            setIsUserAuthorized(owner);
        }
    }, [userId, author]);

    return (
        <Card
            sx={{
                my: 2,
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h5">
                        {deleted ? 'Deleted Idea Post' : title}
                    </Typography>
                }
                subheader={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            {deleted
                                ? 'Post Deleted'
                                : isAuthHidden
                                ? 'Anonymous'
                                : author
                                ? author.name
                                : 'Deleted User'}
                        </div>

                        <div>{getFormatDate(createdAt)}</div>
                    </div>
                }
                action={
                    isUserAuthorized && !deleted ? (
                        <DropDownButton
                            userId={userId}
                            post={post.post}
                            setDialog={setDialog}
                        />
                    ) : null
                }
            />

            <CardContent>
                <Typography variant="body">
                    {deleted ? 'Deleted' : desc}
                </Typography>

                {deleted ? null : (
                    <div>
                        <ImageCarousel items={post.images} />

                        {post.documents.map((doc, i) => {
                            const { _id, filename, url } = doc;
                            return (
                                <Box key={i} marginTop={1}>
                                    <Chip
                                        icon={<DownloadIcon />}
                                        label={filename}
                                        component="a"
                                        href={url}
                                        clickable
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    />
                                </Box>
                            );
                        })}
                    </div>
                )}
            </CardContent>

            {!deleted && (
                <ButtonLayout
                    post={post}
                    userId={userId}
                    setShowForm={setShowForm}
                    showForm={showForm}
                />
            )}

            {dialog && (
                <EditDialog
                    dialog={dialog}
                    setDialog={setDialog}
                    userId={userId}
                    post={post.post}
                />
            )}
        </Card>
    );
}
function ImageCarousel({ items }) {
    return (
        <Box margin={1}>
            <Carousel
                animation="fade"
                navButtonsAlwaysVisible
                autoPlay={false}
                indicatorContainerProps={{
                    style: {
                        position: 'absolute',
                        bottom: '20px',
                    },
                }}
            >
                {items.map((item, i) => (
                    <Item key={i} item={item} />
                ))}
            </Carousel>
        </Box>
    );
}

function Item(props) {
    const { _id, url, filename } = props.item;

    return (
        <Paper sx={{ height: '400px', position: 'relative' }}>
            <Image
                loader={() => url}
                src={url}
                alt={filename}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
            />
        </Paper>
    );
}
