import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFruit, deleteFruit, getFruits, patchFruit } from '../api/fruits-api'
import Auth from '../auth/Auth'
import { Fruit } from '../types/Fruit'

interface FruitsProps {
  auth: Auth
  history: History
}

interface FruitsState {
  fruits: Fruit[]
  newFruitName: string
  loadingFruits: boolean
}

export class Fruits extends React.PureComponent<FruitsProps, FruitsState> {
  state: FruitsState = {
    fruits: [],
    newFruitName: '',
    loadingFruits: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFruitName: event.target.value })
  }

  onEditButtonClick = (fruitId: string) => {
    this.props.history.push(`/fruits/${fruitId}/edit`)
  }

  onFruitCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newFruit = await createFruit(this.props.auth.getIdToken(), {
        name: this.state.newFruitName,
        dueDate
      })
      this.setState({
        fruits: [...this.state.fruits, newFruit],
        newFruitName: ''
      })
    } catch {
      alert('Fruit creation failed')
    }
  }

  onFruitDelete = async (fruitId: string) => {
    try {
      await deleteFruit(this.props.auth.getIdToken(), fruitId)
      this.setState({
        fruits: this.state.fruits.filter(fruit => fruit.fruitId !== fruitId)
      })
    } catch {
      alert('Fruit deletion failed')
    }
  }

  onFruitCheck = async (pos: number) => {
    try {
      const fruit = this.state.fruits[pos]
      await patchFruit(this.props.auth.getIdToken(), fruit.fruitId, {
        name: fruit.name,
        dueDate: fruit.dueDate,
        done: !fruit.done
      })
      this.setState({
        fruits: update(this.state.fruits, {
          [pos]: { done: { $set: !fruit.done } }
        })
      })
    } catch {
      alert('Fruit deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const fruits = await getFruits(this.props.auth.getIdToken())
      this.setState({
        fruits,
        loadingFruits: false
      })
    } catch (e) {
      alert(`Failed to fetch fruits: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Fruits</Header>

        {this.renderCreateFruitInput()}

        {this.renderFruits()}
      </div>
    )
  }

  renderCreateFruitInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onFruitCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFruits() {
    if (this.state.loadingFruits) {
      return this.renderLoading()
    }

    return this.renderFruitsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Fruits
        </Loader>
      </Grid.Row>
    )
  }

  renderFruitsList() {
    return (
      <Grid padded>
        {this.state.fruits.map((fruit, pos) => {
          return (
            <Grid.Row key={fruit.fruitId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onFruitCheck(pos)}
                  checked={fruit.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {fruit.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {fruit.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(fruit.fruitId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFruitDelete(fruit.fruitId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {fruit.attachmentUrl && (
                <Image src={fruit.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
