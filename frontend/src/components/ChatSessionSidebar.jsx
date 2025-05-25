// src/components/ChatSessionSidebar.jsx
import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ChatSessionSidebar = ({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onDelete,
  mobileOpen,
  handleDrawerToggle,
  isMobile,
}) => {
  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Chats</Typography>
        <Tooltip title="New Chat">
          <IconButton onClick={onCreate}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <List>
        {sessions.map((session) => (
          <ListItem
            key={session.id}
            disablePadding
            secondaryAction={
              <Tooltip title="Delete">
                <IconButton edge="end" onClick={() => onDelete(session.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemButton
              selected={session.id === activeSessionId}
              onClick={() => onSelect(session.id)}
            >
              <ListItemText
                primary={session.title || 'Untitled Chat'}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return isMobile ? (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
    >
      {drawer}
    </Drawer>
  ) : (
    <Box
      sx={{
        width: 250,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {drawer}
    </Box>
  );
};

export default ChatSessionSidebar;
