import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actionParams from '../redux/actions/params.action'

const useParams = () => {
  const dispatch = useDispatch()
  const params = useSelector((state) => state.params)
  const setParams = useCallback(
    /**
    * @param {string} paramName - (required) name of params.
    * @param {Object} payload - (required) payload of params.
    */
    (paramName, payload) => {
      dispatch(actionParams.setParams(paramName, payload))
    }, [dispatch],
  )

  const clearParams = useCallback(
    /**
    * @param {string} paramName - (required) name of params.
    */
    (paramName) => {
      dispatch(actionParams.clearParams(paramName))
    }, [dispatch],
  )
  return { params, setParams, clearParams }
}

export default useParams
