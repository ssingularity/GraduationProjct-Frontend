<template>
  <div>
    <el-tree ref="tree" :data="treeData" :expand-on-click-node="false" :highlight-current="true">
      <span slot-scope="{node, data}">
        <type :type="data.type"/>
        <span>{{data.keyName}}</span>
        <span v-if="data.defaultValue != null"> (default: {{data.defaultValue}})</span>
        <span v-if="editable">
          <i v-if="data.type == 'Object'" class="el-icon-plus icon" @click="wakeUpCreator(node, data)"/>
          <i v-if="data.type != 'Object'" class="el-icon-edit icon" @click="wakeUpEditor(node, data)"/>
          <i v-if="data.keyName != null" class="el-icon-delete icon" @click="remove(node,data)"/>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="增加节点"
      :visible.sync="creator_visible">
      <el-form :model="added_data" label-position="top">
        <el-form-item label="键名">
          <el-input v-model="added_data.keyName"></el-input>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input v-model="added_data.defaultValue"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="added_data.type" placeholder="请选择">
            <el-option value="String" label="String"/>
            <el-option value="Integer" label="Integer"/>
            <el-option value="Object" label="Object"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="added_data.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doCreatorClose">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改节点"
      :visible.sync="editor_visible">
      <el-form :model="cur_data" label-position="top">
        <el-form-item label="键名">
          <el-input v-model="cur_data.keyName"></el-input>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input v-model="cur_data.defaultValue"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="cur_data.type" placeholder="请选择">
            <el-option value="String" label="String"/>
            <el-option value="Integer" label="Integer"/>
            <el-option value="Object" label="Object"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="cur_data.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doEditorClose">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Type from "@/components/Descriptor/Type";

  export default {
    name: 'Descriptor',
    components: {
      Type
    },
    computed: {
      treeData() {
        let res = [];
        res.push(this.localSchema);
        return res
      }
    },
    data() {
      return {
        localSchema: this.schema,
        cur_data: {},
        added_data: {},
        editor_visible: false,
        creator_visible: false,
        visible: true
      }
    },
    props: {
      schema: Object,
      editable: Boolean
    },
    methods: {
      wakeUpEditor(node, data) {
        this.cur_data = data;
        this.editor_visible = true;
      },

      wakeUpCreator(node, data) {
        this.cur_data = data;
        this.creator_visible = true;
      },

      doAdd() {
        this.creator_visible = false;
        if (this.added_data.type == "Object") {
          this.$set(this.added_data, 'children', []);
        }
        this.cur_data.children.push(this.added_data);
        this.$set(this.cur_data, 'children', this.cur_data.children);
        this.added_data = {};
        this.$emit('change', this.localSchema);
      },

      doEdit() {
        this.editor_visible = false;
        if (this.cur_data.type == "Object") {
          this.$set(this.cur_data, 'children', []);
        }
        this.$emit('change', this.localSchema);
      },

      doCreatorClose() {
        this.creator_visible = false;
        this.added_data = {};
      },

      doEditorClose() {
        this.editor_visible = false;
        this.cur_data = {};
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.keyName === data.keyName);
        children.splice(index, 1);
        this.$emit('change', this.localSchema);
      },

      reload() {
        this.visible = false;
        this.visible = true;
      }
    }
  }
</script>

<style scoped>
  .icon {
    margin-left: 10px;
  }
</style>
