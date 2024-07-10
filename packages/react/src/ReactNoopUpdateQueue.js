/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  // 개발 환경에서만 경고 출력
  if (__DEV__) {
    // 경고 메시지에 사용할 컴포넌트 이름을 결정
    const constructor = publicInstance.constructor;
    const componentName =
      (constructor && (constructor.displayName || constructor.name)) ||
      'ReactClass';
    // 경고를 출력한 경우 중복 출력을 방지
    const warningKey = `${componentName}.${callerName}`;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    // 마운트되지 않은 컴포넌트에서 상태 업데이트 메서드를 호출하려고 할 때
    // 발생하는 문제와 해결 방법에 대한 상세한 경고 메시지를 출력
    console.error(
      "Can't call %s on a component that is not yet mounted. " +
        'This is a no-op, but it might indicate a bug in your application. ' +
        'Instead, assign to `this.state` directly or define a `state = {};` ' +
        'class property with the desired state in the %s component.',
      callerName,
      componentName,
    );
    // 동일한 경고의 중복 출력을 방지하기 위해 경고 발생을 기록
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
const ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (
    publicInstance,
    completeState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (
    publicInstance,
    partialState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'setState');
  },
};

export default ReactNoopUpdateQueue;
