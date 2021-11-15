# from flask import Flask

# app = Flask(__name__)

# @app.route("/6900")
# def hello():
#     return "Hello World"

# if __name__=='__main__':
#     app.run()

# import sklearn_json as skljson
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
import tempfile
import matplotlib.pyplot as plt
import numpy as np
import pprint
from sklearn.preprocessing import MinMaxScaler


from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree

def export_dict(clf, feature_names=None):

    """Structure of rules in a fit decision tree classifier
    Parameters
    ----------
    clf : DecisionTreeClassifier
        A tree that has already been fit.
    features, labels : lists of str
        The names of the features and labels, respectively.
    """

    tree = clf.tree_
    if feature_names is None:
        feature_names = range(clf.max_features_)
    
    # Build tree nodes
    tree_nodes = []
    for i in range(tree.node_count):
        if (tree.children_left[i] == tree.children_right[i]):
            tree_nodes.append({"name":"leaf","feat":2, "val":0.1})
           #     clf.classes_[np.argmax(tree.value[i])]
        
        else:
            tree_nodes.append({
                "name": feature_names[tree.feature[i]],
                "val": 0.1,#tree.threshold[i],
                "feat":2,
                "left": tree.children_left[i],
                "right": tree.children_right[i],
            })
    
    #print(tree_nodes)
    # Link tree nodes
    for node in tree_nodes:
        #print(node)
        if node["name"]!="leaf":
            node["children"] = list()
            node["children"].append(tree_nodes[node["right"]])
            node["children"].append(tree_nodes[node["left"]])

    # for node in tree_nodes:
    #     print(node)
    #     if node["name"]!="leaf": 


    #print(tree_nodes[0])

    # Return root node
    return tree_nodes[0]

def export_links():
    # Need to write a function to export n links from each tree
    return True

def export_matrix():
    # Create a matrix that holds data and links
    return True

ax = plt.subplot()
data = load_iris()

clf = DecisionTreeClassifier(max_depth=3)
clf.fit(data.data, data.target)
# node = {}
scale = MinMaxScaler()
d = scale.fit_transform(data.data)
# r = rules(clf, data.feature_names, data.target_names)
# plt.show()
js = export_dict(clf,feature_names= data.feature_names)

#pprint.pprint(js)
print(js)

plot_tree(clf, filled=True,feature_names = data.feature_names, ax = ax,node_ids=True)
plt.tight_layout()
plt.savefig('dt.jpg')
plt.show()

# clf = DecisionTreeClassifier()
# iris = load_iris()
# clf = clf.fit(iris.data, iris.target)
# out_file = export_text(clf)

#js= skljson.to_json(clf,"s")

#out_file = export_json(clf, out_file=tempfile.TemporaryFile())
#out_file.close()11111111
ruleMatrix = np.array(clf.tree_.decision_path(data.data.astype("float32")).todense()).astype("int")
ruleJson = {}


for i in range(1,7):
    ruleJson[i-1] = ruleMatrix[:,i].flatten().tolist()

dataJson = {}
for i,name in enumerate(data.feature_names):
    dataJson[str(name)] = list(d[:,i].flatten())

import json
# print(ruleJson)
with open("dataJson.json", "w") as jsData:
    jsonString = json.dumps(dataJson)
    jsData.writelines(jsonString)

with open("ruleJson.json", "w") as jsData:
    jsonString = json.dumps(ruleJson)
    jsData.writelines(jsonString)