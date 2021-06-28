import { extend } from '@vue/shared'
import { getFileName } from '../../../helpers/file'
import { TEMP_PATH } from '../constants'
import {
  API_COMPRESS_VIDEO,
  API_TYPE_COMPRESS_VIDEO,
  defineAsyncApi,
  CompressVideoOptions,
  CompressVideoProtocol,
} from '@dcloudio/uni-api'

export const compressVideo = defineAsyncApi<API_TYPE_COMPRESS_VIDEO>(
  API_COMPRESS_VIDEO,
  (options, { resolve, reject }) => {
    const dst = `${TEMP_PATH}/compressed/${Date.now()}_${getFileName(
      options.src
    )}`
    plus.zip.compressVideo(
      extend({}, options, {
        dst,
      }),
      () => {
        resolve({
          tempFilePath: dst,
        })
      },
      reject
    )
  },
  CompressVideoProtocol,
  CompressVideoOptions
)
