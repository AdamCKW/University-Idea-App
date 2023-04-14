import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getFormatDate } from '@/utils/getFormatDate';
import DropDownButton from '@/sections/feed/individual/comments/DropDownButton';
import EditCommentDialog from '@/sections/feed/individual/comments/EditCommentDialog';

export default function CommentCard({ comment, userId, postId }) {
    const [dialog, setDialog] = useState(false);
    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    const { _id, author, isAuthHidden, createdAt, deleted } = comment;

    const formattedDate = getFormatDate(createdAt);

    useEffect(() => {
        if (author !== null) {
            const owner = userId === author._id;
            setIsUserAuthorized(owner);
        }
    }, [userId, author]);

    return (
        <>
            <Card
                sx={{
                    my: 2,
                }}
            >
                <CardHeader
                    title={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h6" color="InfoText">
                                {deleted
                                    ? 'Deleted Comment'
                                    : isAuthHidden
                                    ? 'Anonymous'
                                    : author
                                    ? author.name
                                    : 'Deleted User'}
                            </Typography>

                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                            >
                                {formattedDate}
                            </Typography>
                        </div>
                    }
                    action={
                        isUserAuthorized && !deleted ? (
                            <DropDownButton
                                userId={userId}
                                comment={comment}
                                setDialog={setDialog}
                                postId={postId}
                            />
                        ) : null
                    }
                />

                <CardContent>
                    <Typography variant="body1">
                        {deleted ? 'Deleted Comment' : comment.comment}
                    </Typography>
                </CardContent>

                {dialog && (
                    <EditCommentDialog
                        dialog={dialog}
                        postId={postId}
                        setDialog={setDialog}
                        userId={userId}
                        comment={comment}
                    />
                )}
            </Card>
        </>
    );
}
