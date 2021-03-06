import React, { useState, useEffect } from "react";

import {
  fetchTodoLists,
  fetchTodoListEntries,
  addTodoList,
  updateTodoList,
  deleteTodoList,
  addTodoListEntry,
  updateTodoListEntry,
  deleteTodoListEntry,
} from "../../actions/dashboard";

import TodoList from "./TodoList";
import TodoListItem from "./TodoListItem";

import {
  makeStyles,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Typography,
} from "@material-ui/core";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  canvas: {
    flexGrow: 1,
    minHeight: "60vh",
  },
  flexGrow1: {
    flexGrow: 1,
  },
  todoListEntries: {
    height: "100%",
    padding: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
  },
  border1: {
    border: "1px solid black",
  },
  border2: {
    border: "1px solid red",
  },
  bottomBorderOnly: {
    borderBottom: "1px solid #bdc3c7",
  },
  w100: {
    width: "100%",
  },
  h100: {
    height: "100%",
  },
  w80: {
    width: "80%",
  },
  p8: {
    padding: "8px",
  },
  mt8: {
    marginTop: "8px",
  },
  addTodoListBtn: {
    color: "#2ecc71",
  },
  AddTodoListDialog: {
    minWidth: "420px",
  },
  header: {
    marginTop: "32px",
    marginBottom: "32px",
  },
  underline: {
    textDecoration: "underline",
  },
}));

const Dashboard = (props) => {
  const [todoLists, setTodoLists] = useState([]);
  const [todoListEntries, setTodoListEntries] = useState([]);
  const [isLoadingTodoLists, setLoadingTodoLists] = useState(false);
  const [isLoadingTodoListEntries, setLoadingTodoListEntries] = useState(false);

  const [openTodoListDialog, setTodoListDialog] = useState(false);
  const [updateTodoListDialog, setUpdateTodoListDialog] = useState(false);
  const [newTodoListField, setNewTodoListField] = useState("");
  const [updateTodoListField, setUpdateTodoListField] = useState("");
  const [addTodoListEntryField, setTodoListEntryField] = useState("");
  const [currentTodoList, setCurrentTodoList] = useState({});

  useEffect(() => {
    const fetchUserTodoLists = async () => {
      setTodoLists(await fetchTodoLists(setLoadingTodoLists));
    };
    fetchUserTodoLists();
  }, []);

  const classes = useStyles(); // CSS Styling for UI elements

  /**
   * Handles clicks on the a todo list
   * @param {number} index
   */
  const handleOnClickList = async (index) => {
    if (todoLists[index].todoListId) {
      setCurrentTodoList(todoLists[index]);
      setTodoListEntries(
        await fetchTodoListEntries(
          todoLists[index].todoListId,
          setLoadingTodoListEntries
        )
      );
    }
  };

  /**
   * Handles clicks on todo list's edit icon
   * @param {number} index
   */
  const handleOnClickUpdateList = async (index) => {
    setCurrentTodoList(todoLists[index]);
  };

  /**
   * Handles clicks on todo list's delete icon
   * @param {number} index
   */
  const handleOnClickDeleteList = async (index) => {
    const todoListsClone = [...todoLists];
    todoListsClone[index].title = "";
    deleteTodoList(
      todoListsClone[index].todoListId,
      setLoadingTodoLists,
      setTodoLists,
      setTodoListEntries
    );
    todoListsClone.splice(index, 1);
    if (index !== undefined) {
      setCurrentTodoList(todoListsClone[index]);
    }
    setTodoLists(todoListsClone);
  };

  /**
   * Handles clicks on an entry
   * @param {number} index
   * @param {boolean} value
   */
  const handleOnClickEntry = (index, value) => {
    const todoListEntriesClone = [...todoListEntries];
    todoListEntriesClone[index].status = value;
    setTodoListEntries(todoListEntriesClone);
  };

  /**
   * Handles clicks on entry's edit icon
   * @param {number} index
   * @param {boolean} value
   */
  const handleOnClickUpdateEntry = (index, value) => {
    const todoListEntriesClone = [...todoListEntries];
    todoListEntriesClone[index].entry = value;
    updateTodoListEntry(
      currentTodoList,
      todoListEntriesClone[index].entryId,
      todoListEntriesClone[index].entry,
      setLoadingTodoListEntries,
      setTodoListEntries
    );
  };

  /**
   * Handles clicks on entry's delete icon
   * @param {number} index
   */
  const handleOnClickDeleteEntry = (index) => {
    const todoListEntriesClone = [...todoListEntries];
    deleteTodoListEntry(
      currentTodoList,
      todoListEntriesClone[index].entryId,
      setLoadingTodoListEntries,
      setTodoListEntries
    );
    todoListEntriesClone.splice(index, 1);
    setTodoListEntries(todoListEntriesClone);
  };

  const handleUpdateTodoListDialog = () => {
    setUpdateTodoListDialog(true);
  };

  /**
   * Maps through todolists to render them
   */
  const todoListsMap = todoLists.map((list, index) => {
    return (
      <TodoList
        title={list.title}
        handleOnClickList={handleOnClickList}
        handleOnClickUpdateList={handleOnClickUpdateList}
        handleOnClickDeleteList={handleOnClickDeleteList}
        handleUpdateTodoListDialog={handleUpdateTodoListDialog}
        key={index}
        index={index}
      />
    );
  });

  /**
   * Maps through entries to render them
   */
  const todoListEntriesMap = todoListEntries.map((entry, index) => {
    return (
      <TodoListItem
        entry={entry}
        index={index}
        handleOnClickEntry={handleOnClickEntry}
        handleOnClickUpdateEntry={handleOnClickUpdateEntry}
        handleOnClickDeleteEntry={handleOnClickDeleteEntry}
        key={index}
      />
    );
  });

  const handleOpenTodoListDialog = (event) => {
    event.preventDefault();
    setTodoListDialog(true);
  };

  const handleNewTodoListFieldChange = (event) => {
    setNewTodoListField(event.target.value);
  };

  const handleUpdateTodoListFieldChange = (event) => {
    setUpdateTodoListField(event.target.value);
  };

  const handleCloseTodoListDialog = () => {
    setTodoListDialog(false);
    setUpdateTodoListDialog(false);
  };

  const handleCreateTodoList = (event) => {
    event.preventDefault();

    if (newTodoListField && newTodoListField.length > 0) {
      const newTodoList = {
        title: newTodoListField,
        description: "",
        status: "planned",
      };

      addTodoList(newTodoList, setLoadingTodoLists, setTodoLists);
      setTodoListDialog(false);
      setNewTodoListField("");
    }
  };

  const handleUpdateTodoList = (event) => {
    event.preventDefault();
    if (updateTodoListField && updateTodoListField.length > 0) {
      currentTodoList.title = updateTodoListField;
      updateTodoList(
        currentTodoList.todoListId,
        currentTodoList.title,
        setLoadingTodoLists,
        setTodoLists
      );
      setUpdateTodoListDialog(false);
      setNewTodoListField("");
    }
  };

  const handleAddTodoListEntry = (event) => {
    if (
      currentTodoList &&
      addTodoListEntryField &&
      addTodoListEntryField.length > 0
    ) {
      event.preventDefault();

      const newTodoListEntry = {
        title: addTodoListEntryField,
        todo_list_id: currentTodoList.todoListId,
        description: "",
        status: "planned",
      };

      addTodoListEntry(
        newTodoListEntry,
        setLoadingTodoListEntries,
        setTodoListEntries
      );

      setTodoListEntryField("");
    }
  };

  const handleNewEntryFieldChange = (event) => {
    setTodoListEntryField(event.target.value);
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Typography variant="h4" className={classes.header}>
          Your To-do Lists
        </Typography>
      </Grid>
      <Grid item className={classes.w100}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="stretch"
          className={classes.canvas}
        >
          <Grid item xs={8}>
            <Paper
              variant="outlined"
              square
              elevation={3}
              className={classes.h100}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={classes.h100}
              >
                <Grid item xs={4}>
                  <Paper variant="outlined" square className={classes.h100}>
                    <Grid container direction="column" justify="flex-start">
                      {isLoadingTodoLists === false ? (
                        todoListsMap
                      ) : (
                        <Grid item>
                          <CircularProgress />
                        </Grid>
                      )}
                      {isLoadingTodoLists === false ? (
                        <Grid item className={classes.mt8}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="center"
                            spacing={1}
                          >
                            <Grid item>
                              <IconButton
                                size="medium"
                                onClick={handleOpenTodoListDialog}
                              >
                                <AddCircleIcon
                                  className={classes.addTodoListBtn}
                                  fontSize="large"
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : (
                        <div />
                      )}
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={8}>
                  <Paper
                    variant="outlined"
                    square
                    className={classes.todoListEntries}
                  >
                    <Grid container direction="column" justify="flex-start">
                      {currentTodoList && isLoadingTodoListEntries === false ? (
                        <Grid item xs={12}>
                          <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                          >
                            <Typography
                              variant="h6"
                              className={classes.underline}
                            >
                              {currentTodoList.title}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <div />
                      )}
                      {isLoadingTodoListEntries === false ? (
                        todoListEntriesMap
                      ) : (
                        <Grid item>
                          <CircularProgress />
                        </Grid>
                      )}
                      {currentTodoList &&
                      currentTodoList.title &&
                      isLoadingTodoListEntries === false ? (
                        <Grid item xs={12}>
                          <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item xs={11}>
                              <TextField
                                margin="none"
                                label="Add A New Entry"
                                size="small"
                                fullWidth
                                onChange={handleNewEntryFieldChange}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <IconButton onClick={handleAddTodoListEntry}>
                                <AddIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : (
                        <div />
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Dialog
            open={openTodoListDialog}
            onClose={handleCloseTodoListDialog}
            className={classes.AddTodoListDialog}
          >
            <DialogTitle>Add A New Todo List</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                type="email"
                fullWidth
                onChange={handleNewTodoListFieldChange}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseTodoListDialog} color="primary">
                Cancel
              </Button>

              <Button onClick={handleCreateTodoList} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={updateTodoListDialog}
            onClose={handleCloseTodoListDialog}
            className={classes.AddTodoListDialog}
          >
            <DialogTitle>Edit Title</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label={currentTodoList.title}
                type="email"
                fullWidth
                onChange={handleUpdateTodoListFieldChange}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseTodoListDialog} color="primary">
                Cancel
              </Button>

              <Button onClick={handleUpdateTodoList} color="primary">
                Edit
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
