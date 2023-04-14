import React, { useState, useEffect, useRef } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    Menu,
    MenuItem,
    Stack,
} from '@mui/material';

import axios from 'axios';
import { usePostContext } from 'src/context/post-context';
import { useAlertContext } from 'src/context/alert-context';
import { useSWRConfig } from 'swr';

export default function DropDownButton({ userId, post, setDialog }) {
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();
    const [openModal, setOpenModal] = useState(false);
    const { feedUrl } = usePostContext();
    const { mutate } = useSWRConfig();
    const { author, title } = post;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleEdit = () => {
        if (userId === author._id) {
            setDialog(true);
            setAnchorEl(null);
        }
    };

    const handleDelete = async () => {
        if (userId === author._id) {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    userId,
                },
            };

            try {
                await axios.put(`/api/posts/${post.id}/delete`, options);
                mutate(feedUrl);
            } catch (error) {
                setAlertMessage(error.response.data);
                setIsError(true);
                setAlertOpen(true);
            }
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Stack direction="row" spacing={2}>
            <div>
                <IconButton
                    id="positioned-button"
                    aria-controls={open ? 'positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    id="positioned-menu"
                    aria-labelledby="positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem onClick={handleEdit}>Edit Post</MenuItem>

                    <MenuItem onClick={handleOpenModal}>
                        <Typography variant="body1" color="error">
                            Delete Post
                        </Typography>
                    </MenuItem>
                </Menu>
            </div>

            <ConfirmationDialog
                open={openModal}
                handleCloseModal={handleCloseModal}
                handleConfirm={handleDelete}
                title={`Delete Post`}
                confirmLabel="Delete"
            >
                Are you sure you want to delete this post?
            </ConfirmationDialog>
        </Stack>
    );
}

function ConfirmationDialog({
    open,
    handleCloseModal,
    handleConfirm,
    title,
    confirmLabel,
    children,
}) {
    return (
        <Dialog open={open} onClose={handleCloseModal}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary">
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
