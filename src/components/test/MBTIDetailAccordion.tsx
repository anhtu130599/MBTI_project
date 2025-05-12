import { FC } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MBTIDescriptionDetail } from '@/data/mbtiDescriptions';

interface MBTIDetailAccordionProps {
  detail: MBTIDescriptionDetail;
}

const MBTIDetailAccordion: FC<MBTIDetailAccordionProps> = ({ detail }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 700, mt: 3 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Tổng quan</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{detail.overview}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Đặc điểm nổi bật</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {detail.traits.map((trait, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={trait} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Giá trị cốt lõi</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {detail.values.map((value, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Cách giao tiếp</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{detail.communication}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Mối quan hệ & công việc</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{detail.relationships}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Lời khuyên phát triển bản thân</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{detail.advice}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MBTIDetailAccordion; 