import React, { PureComponent, Component } from 'react'
import { render } from 'react-dom'
import '@atlaskit/css-reset'
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import initialData from './initial-data'
import Column from './column'

const Container = styled.div`
  display: flex;
`

class InnerList extends PureComponent {
  render() {
    const { column, taskMap, index } = this.props
    const tasks = column.taskIds.map(taskId => taskMap[taskId])
    return <Column { ...{ column, tasks, index }} />
  }
}

class App extends Component {

  state = initialData

  onDragEnd = ({ destination, source, draggableId, type }) => {

    if (destination && !(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )) {
  
      if (type === 'column') {
  
        const newColumnOrder = Array.from(this.state.columnOrder)
        newColumnOrder.splice(source.index, 1)
        newColumnOrder.splice(destination.index, 0, draggableId)
  
        return this.setState((lastState) => ({
          ...lastState,
          columnOrder: newColumnOrder,
        }))
  
      }
  
      const home = this.state.columns[source.droppableId]
      const foreign = this.state.columns[destination.droppableId]
  
      if (home === foreign) {
  
        const newTaskIds = Array.from(home.taskIds)
        newTaskIds.splice(source.index, 1)
        newTaskIds.splice(destination.index, 0, draggableId)
  
        return this.setState(lastState => ({
          ...lastState,
          columns: {
            ...lastState.columns,
            [home.id]: {
              ...home,
              taskIds: newTaskIds,
            },
          },
        }))
        
      }
  
      // moving from one list to another
  
      const homeTaskIds = [ ...home.taskIds ]
      homeTaskIds.splice(source.index, 1)
  
      const foreignTaskIds = [ ...foreign.taskIds ]
      foreignTaskIds.splice(destination.index, 0, draggableId)
  
      return this.setState(lastState => ({
        ...lastState,
        columns: {
          ...lastState.columns,
          [home.id]: {
            ...home,
            taskIds: homeTaskIds,
          },
          [foreign.id]: {
            ...foreign,
            taskIds: foreignTaskIds,
          },
        },
      }))

    }
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <Container
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId];
                return (
                  <InnerList
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}
                  />
                )
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
  
}

render(<App />, document.getElementById('root'));
