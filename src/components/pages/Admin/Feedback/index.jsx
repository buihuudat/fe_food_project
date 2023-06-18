import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import userApi from "../../../../api/userApi";
import Toast from "../../../common/Toast";
import CardFeedback from "./cardFeedback";

const Feedback = () => {
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const feedbacks = useSelector((state) => state.user.allFeedback);
  const [active, setactive] = useState(0);

  const handleSubmit = async (e) => {
    document.title = "Feedback | Administrator";

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

  const handleChange = (e) => {
    setactive(e.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="demo-simple-select-label">Resolve</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={active}
          label="Resolve"
          onChange={handleChange}
        >
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </Select>
      </FormControl>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        {feedbacks?.map((feedback) => {
          if (active && feedback.resolve) {
            return (
              <CardFeedback
                key={feedback._id}
                feedback={feedback}
                handleSubmit={handleSubmit}
                hidden={hidden}
                setHidden={setHidden}
                setReplyContent={setReplyContent}
                loading={loading}
                setLoading={setLoading}
              />
            );
          }
        })}
      </Container>
    </Box>
  );
};

export default Feedback;
