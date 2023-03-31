import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getFormatDate } from '@/utils/getFormatDate';
import DropDownButton from '@/sections/feed/individual/comments/DropDownButton';
import EditCommentDialog from '@/sections/feed/individual/comments/EditCommentDialog';

export default function CommentCard({ comment, userId, postId }) {
    const [dialog, setDialog] = useState(false);
    const { _id, author, isAuthHidden, createdAt } = comment;

    const formattedDate = getFormatDate(createdAt);

    const isUserAuthorized = userId === author._id;

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
                                {isAuthHidden ? 'Anonymous' : author.name}
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
                        isUserAuthorized && (
                            <DropDownButton
                                userId={userId}
                                comment={comment}
                                setDialog={setDialog}
                                postId={postId}
                            />
                        )
                    }
                />

                <CardContent>
                    <Typography variant="body1">{comment.comment}</Typography>
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
