import React, { useEffect, useState } from "react";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import * as monaco from "monaco-editor";
import { MethodObject, OpenrpcDocument } from "@open-rpc/meta-schema";
import { addDiagnostics } from "@etclabscore/monaco-add-json-schema-diagnostics";
import openrpcDocumentToJSONRPCSchema from "../helpers/openrpcDocumentToJSONRPCSchema";
import { Grid } from "@material-ui/core";

interface IProps {
  onChange?: (newValue: any) => void;
  openrpcMethodObject?: MethodObject;
  openrpcDocument?: OpenrpcDocument;
  value: any;
}

const CustomEditor: React.FC<IProps> = (props) => {
  const [editor, setEditor]: [any, any] = useState();

  useEffect(() => {
    if (!editor) {
      return;
    }
    const modelName = (props.openrpcDocument && props.openrpcDocument.info) ? props.openrpcDocument.info.title : "inspector";
    const modelUriString = `inmemory://${modelName}-${Math.random()}.json`;
    const modelUri = monaco.Uri.parse(modelUriString);
    const model = monaco.editor.createModel(props.value || "", "json", modelUri);
    (editor as any).setModel(model);
    let schema: any = {
      type: "object",
      properties: {
        jsonrpc: {
          type: "string",
          const: "2.0",
        },
        id: {
          oneOf: [
            {
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        method: {
          type: "string",
        },
      },
    };

    if (props.openrpcDocument) {
      schema = openrpcDocumentToJSONRPCSchema(props.openrpcDocument);
    } else {
      schema = {
        additionalProperties: false,
        properties: {
          ...schema.properties,
          params: {
            oneOf: [
              { type: "array" },
              { type: "object" },
            ],
          },
        },
      };
    }
    addDiagnostics(modelUri.toString(), schema, monaco);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openrpcDocument, editor]);

  function handleEditorDidMount(_: any, ed: any) {
    setEditor(ed);
  }

  const handleChange = (ev: any, value: any) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <MonacoEditor
      height="500px"
      width="100%"
      value={props.value}
      editorDidMount={handleEditorDidMount}
      editorOptions={{
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
        fixedOverflowWidgets: true,
      }}
      language="json"
      onChange={handleChange}
    />
  );
};

export default CustomEditor;
