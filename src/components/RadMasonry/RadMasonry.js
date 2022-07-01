import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { widthPercentageToPx, heightPercentageToPx, getScreenSizeMultiplier } from '../../utilities/iosAndroidDim';

class RadMasonry extends Component {

    isCloseToBottom = (e, onEndReachedThreshold) => {
        const { layoutMeasurement, contentOffset, contentSize } = e;
        const paddingToBottom = contentSize.height * onEndReachedThreshold;
        return (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
        );
    };

    render() {
        return (
            <>
                <FlatList
                    renderItem={null}
                    keyExtractor={null}
                    data={null}
                    showsVerticalScrollIndicator={false}
                    onScroll={(e) => {
                        const nativeEvent = e.nativeEvent;
                        if (this.isCloseToBottom(nativeEvent, this.props.onEndReachedThreshold || 0.1)) {
                            this.props.onEndReached(e);
                        }

                    }}
                    ListHeaderComponent={(
                        <View style={{
                            flex: 1,
                            // display: 'flex',
                            // marginBottom: 55 * getScreenSizeMultiplier(),
                            flexDirection: this.props.horizontal ? 'column' : 'row',
                        }}
                        >
                            {Array.from(Array(this.props.numColumns || 2), (_, num) => {
                                return (
                                    <View
                                        key={`rad-masonry-column-${num}`}
                                        style={{
                                            flex: 1 / (this.props.numColumns || 2),
                                            flexDirection: this.props.horizontal ? 'row' : 'column',
                                        }}
                                    >
                                        {this.props.data.map((el, i) => {
                                            if (i % (this.props.numColumns || 2) === num) {
                                                return (
                                                    <View>
                                                        {this.props.renderItem({ item: el, i })}
                                                    </View>
                                                );
                                            }
                                            return null;
                                        }).filter((e) => !!e)}
                                    </View>

                                );

                            })}
                        </View>
                    )}
                />
            </>
        )
    }

}

export default RadMasonry;