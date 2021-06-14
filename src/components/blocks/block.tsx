export type Props = {
    color?: string;
    style?: Record<string, any>;
    height?: number;
}

export function Block(props: Props) {
    const {color = 'grey', height = 100, style = {}} = props;
    return (
        <div style={{backgroundColor: color, height, ...style}}/>
    )
}