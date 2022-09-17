import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import userApi from "../../../../api/userApi";
import Toast from "../../../common/Toast";

const Feedback = () => {
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const feedbacks = useSelector((state) => state.user.allFeedback);

  const handleSubmit = async (e) => {
    const data = {
      content: replyContent,
      user: e.user,
    };

    try {
      await userApi.createNotification(data);
      await userApi.updateFeedback({
        _id: e._id,
        resolve: true,
      });
      Toast("success", "Done!!");
      setHidden(true);
      setLoading(true);
    } catch (error) {
      Toast("error", "Farlure!!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {feedbacks?.map((feedback, index) => {
        if (!feedback.resolve) {
          return (
            <Paper
              key={index}
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
                <Avatar alt="user" src="" sx={{ width: 60, height: 60 }} />
                <Box>
                  <Typography fontWeight={600} variant="h5">
                    {feedback.title}
                  </Typography>
                  <Typography>{feedback.content}</Typography>
                </Box>
                {hidden && (
                  <Button sx={{ ml: "auto" }} onClick={() => setHidden(false)}>
                    Reply
                  </Button>
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
                  <Box
                    mt={3}
                    sx={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
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
        }
      })}
    </Container>
  );
};

export default Feedback;
