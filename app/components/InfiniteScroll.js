// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import styles from './InfiniteScroll.scss';

export default class InfiniteScroll extends Component {
  props: {
    children: Children,
    isFetching: boolean,
    pageToken: string,
    loadMore: () => Promise<any>
  };

  state: {
    isComplete: boolean
  };
  container: HTMLDivElement;
  handleScroll: () => void;

  constructor(props: any) {
    super(props);
    this.state = {
      isComplete: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(): void {
    const { isFetching, pageToken, loadMore } = this.props;
    if (isFetching || this.state.isComplete) {
      return;
    }
    const { scrollTop, scrollHeight, offsetHeight } = this.container;
    if (scrollTop > scrollHeight - (offsetHeight * 2)) {
      loadMore().then(action => {
        if (action.payload.nextPageToken === pageToken) {
          this.setState(prevState => ({
            isComplete: !prevState.isComplete
          }));
        }
      });
    }
  }

  render() {
    return (
      <div className={styles.infiniteScroll} ref={node => (this.container = node)} onScroll={this.handleScroll}>
        {this.props.children}
      </div>
    );
  }
}