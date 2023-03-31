import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import EditDialog from '@/sections/feed/main/EditDialog';
import DropDownButton from '@/sections/feed/main/card-components/DropDownButton';
import ButtonLayout from '@/sections/feed/main/card-components/ButtonLayout';
import { getFormatDate } from '@/utils/getFormatDate';

export default function PostCard({ userId, post }) {
    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    const [dialog, setDialog] = useState(false);

    const { title, id, author, createdAt, isAuthHidden, likes, dislikes } =
        post;

    const formattedDate = getFormatDate(createdAt);

    useEffect(() => {
        if (author !== null) {
            const owner = userId === author._id;
            setIsUserAuthorized(owner);
        }
    }, [userId, author]);

    return (
        <Card sx={{ my: 2 }}>
            <CardHeader
                title={<Typography variant="h5">{title}</Typography>}
                subheader={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            {isAuthHidden
                                ? 'Anonymous'
                                : author
                                ? author.name
                                : 'Deleted User'}
                        </div>
                        <div>{formattedDate}</div>
                    </div>
                }
                action={
                    isUserAuthorized && (
                        <DropDownButton
                            userId={userId}
                            post={post}
                            setDialog={setDialog}
                        />
                    )
                }
            />

            {/* <CardContent>
                <Typography variant="h5" color="text.secondary"></Typography>
            </CardContent> */}

            <ButtonLayout post={post} userId={userId} />

            <EditDialog
                dialog={dialog}
                setDialog={setDialog}
                userId={userId}
                post={post}
            />
        </Card>
    );
}
