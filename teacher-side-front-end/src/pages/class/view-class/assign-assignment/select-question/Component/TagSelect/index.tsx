import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import classNames from "classnames";
import { useMergedState } from "rc-util";
import React, {
  type FC,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import useStyles from "./index.style";

const { CheckableTag } = Tag;
export interface TagSelectOptionProps {
  value: string | number;
  style?: React.CSSProperties;
  checked?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
  children?: React.ReactNode;
}
const TagSelectOption: React.FC<TagSelectOptionProps> & {
  isTagSelectOption: boolean;
} = ({ children, checked, onChange, value }) => (
  <CheckableTag
    checked={!!checked}
    key={value}
    onChange={(state) => onChange?.(value, state)}
  >
    {children}
  </CheckableTag>
);
TagSelectOption.isTagSelectOption = true;

type TagSelectOptionElement = React.ReactElement<
  TagSelectOptionProps,
  typeof TagSelectOption
>;

export interface TagSelectProps {
  onChange?: (value: (string | number)[]) => void;
  expandable?: boolean;
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  style?: React.CSSProperties;
  hideCheckAll?: boolean;
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  Option?: TagSelectOptionProps;
  children?: TagSelectOptionElement | TagSelectOptionElement[];
}
const TagSelect: FC<TagSelectProps> & {
  Option: typeof TagSelectOption;
} = (props) => {
  const { styles } = useStyles();
  const {
    children,
    hideCheckAll = false,
    className,
    style,
    expandable,
    actionsText = {},
  } = props;
  const [expand, setExpand] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showExpand, setShowExpand] = useState<boolean>(false);

  const [value, setValue] = useMergedState<(string | number)[]>(
    props.defaultValue || [],
    {
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: props.onChange,
    },
  );

  useLayoutEffect(() => {
    // 仅在 expandable 为 true 且 ref 存在时执行
    if (expandable && containerRef.current) {
      const { scrollHeight, offsetHeight } = containerRef.current;
      // 如果滚动高度大于可见高度，说明内容溢出，需要显示展开按钮
      if (scrollHeight > offsetHeight) {
        setShowExpand(true);
      } else {
        setShowExpand(false);
      }
    }
  }, [children, expandable]); // 当 children 或 expandable 属性变化时重新计算

  const isTagSelectOption = (node: TagSelectOptionElement) =>
    node?.type &&
    (node.type.isTagSelectOption ||
      node.type.displayName === "TagSelectOption");

  const getAllTags = () => {
    const childrenArray = React.Children.toArray(
      children,
    ) as TagSelectOptionElement[];
    const checkedTags = childrenArray
      .filter((child) => isTagSelectOption(child))
      .map((child) => child.props.value);
    return checkedTags || [];
  };

  const onSelectAll = (checked: boolean) => {
    let checkedTags: (string | number)[] = [];
    if (checked) {
      checkedTags = getAllTags();
    }
    setValue(checkedTags);
  };

  const handleTagChange = (tag: string | number, checked: boolean) => {
    const checkedTags: (string | number)[] = [...(value || [])];
    const index = checkedTags.indexOf(tag);
    if (checked && index === -1) {
      checkedTags.push(tag);
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    setValue(checkedTags);
  };

  const checkedAll = getAllTags().length === value?.length;
  const {
    expandText = "Expand",
    collapseText = "Collapse",
    selectAllText = "All",
  } = actionsText;

  const cls = classNames(styles.tagSelect, className, {
    [styles.hasExpandTag]: expandable,
    [styles.expanded]: expand,
  });

  return (
    <div ref={containerRef} className={cls} style={style}>
      {hideCheckAll ? null : (
        <CheckableTag
          checked={checkedAll}
          key="tag-select-__all__"
          onChange={onSelectAll}
        >
          {selectAllText}
        </CheckableTag>
      )}
      {children &&
        React.Children.map(children, (child: TagSelectOptionElement) => {
          if (isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: value && value.indexOf(child.props.value) > -1,
              onChange: handleTagChange,
            });
          }
          return child;
        })}

      {expandable && showExpand && (
        <a
          className={styles.trigger}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? (
            <>
              {collapseText} <UpOutlined />
            </>
          ) : (
            <>
              {expandText}
              <DownOutlined />
            </>
          )}
        </a>
      )}
    </div>
  );
};

TagSelect.Option = TagSelectOption;
export default TagSelect;
