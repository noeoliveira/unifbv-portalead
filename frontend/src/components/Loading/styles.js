import { makeStyles } from '@material-ui/core/styles';
import { colors } from '../../utils/colors';

export const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: colors.yellow1,
  },
}));
