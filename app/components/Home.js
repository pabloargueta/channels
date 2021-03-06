// @flow
import React, { Component } from 'react';
import ErrorState from './core/ErrorState';
import Loader from './core/Loader';
import LeftColumn from '../components/LeftColumn';
import RightColumn from '../components/RightColumn';
import type { PromiseAction } from '../constants/types';
import ChannelType from '../dataTypes/channelType';
import styles from './Home.scss';

type Props = {
  token: string,
  isFetching: boolean,
  error: boolean,
  activeChannel: ?ChannelType,
  activeVideo: any,
  fetchAccessToken: () => PromiseAction
};

export default class Home extends Component<Props> {
  intervalId: IntervalID;

  componentDidMount() {
    this.props.fetchAccessToken();
    this.intervalId = this.refreshAccessToken();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refreshAccessToken = (): IntervalID => {
    const fiftyMinutes = 3000000;
    return setInterval(this.props.fetchAccessToken, fiftyMinutes);
  }

  render() {
    const {
      token,
      isFetching,
      error,
      activeChannel,
      activeVideo,
      fetchAccessToken
    } = this.props;
    if (!token || error) {
      return (
        <div className={styles.home}>
          {isFetching ? (
            <Loader />
          ) : (
            <ErrorState
              color="black"
              message="Error accessing your account."
              retry={fetchAccessToken}
            />
          )}
        </div>
      );
    }

    return (
      <div className={styles.home}>
        <LeftColumn
          activeChannel={activeChannel}
        />
        <RightColumn
          activeVideo={activeVideo}
        />
      </div>
    );
  }
}
