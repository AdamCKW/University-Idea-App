import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography,
} from '@mui/material';

export const AccountProfile = (props) => {
    const { userId, name, department, email } = props;

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Avatar
                        sx={{
                            height: 80,
                            mb: 2,
                            width: 80,
                        }}
                    />
                    <Typography gutterBottom variant="h5">
                        {name}
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                        {email}
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                        {department}
                    </Typography>
                </Box>
            </CardContent>
            {/* <Divider />
            <CardActions>
                <Button fullWidth variant="text">
                    Upload picture
                </Button>
            </CardActions> */}
        </Card>
    );
};
