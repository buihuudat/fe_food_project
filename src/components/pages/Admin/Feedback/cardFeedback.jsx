import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import userApi from "../../../../api/userApi";

const CardFeedback = ({
  feedback,
  handleSubmit,
  hidden,
  setHidden,
  setReplyContent,
  loading,
  setLoading,
}) => {
  const [user, setUser] = useState(null);
  const [call, setCall] = useState("call");

  useEffect(() => {
    const getUser = async () => {
      const user = await userApi.get({ _id: feedback.user });
      setUser(user);
    };
    getUser();
  }, [feedback.user]);

  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 3,
        }}
      >
        <Avatar
          alt={user?.fullname}
          src={user?.image}
          sx={{ width: 60, height: 60 }}
        />
        <Box>
          <Box>
            <Typography>{user?.fullname}</Typography>
          </Box>
          <Typography fontWeight={600} variant="h5">
            {feedback.title}
          </Typography>
          <Typography>{feedback.content}</Typography>
        </Box>
        {hidden && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Button
              variant="contained"
              sx={{ ml: "auto" }}
              onClick={() => setCall(user.phone.toString())}
            >
              {call}
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: "auto" }}
              onClick={() => setHidden(false)}
            >
              Reply
            </Button>
          </Box>
        )}
      </Box>
      {!hidden && (
        <Box
          sx={{
            width: "100%",
          }}
        >
          <TextField
            label="Reply"
            fullWidth
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Box mt={3} sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <Button
              fullWidth
              variant="outlined"
              color="warning"
              onClick={() => {
                setHidden(true);
                setLoading(false);
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              fullWidth
              variant="outlined"
              color="success"
              type="submit"
              onClick={() => handleSubmit(feedback)}
            >
              Send
            </LoadingButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default CardFeedback;
